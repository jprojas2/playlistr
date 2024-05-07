class Genius
  GeniusAPIError = Class.new(StandardError)
  BadRequestError = Class.new(GeniusAPIError)
  UnauthorizedError = Class.new(GeniusAPIError)
  ForbiddenError = Class.new(GeniusAPIError)
  ApiRequestsQuotaReachedError = Class.new(GeniusAPIError)
  NotFoundError = Class.new(GeniusAPIError)
  UnprocessableEntityError = Class.new(GeniusAPIError)
  ApiError = Class.new(GeniusAPIError)
  CredentialsMissingError = Class.new(GeniusAPIError)
  
  HTTP_OK_CODE = 200
  HTTP_CREATED_CODE = 201
  HTTP_NO_CONTENT = 204

  HTTP_BAD_REQUEST_CODE = 400
  HTTP_UNAUTHORIZED_CODE = 401
  HTTP_FORBIDDEN_CODE = 403
  HTTP_NOT_FOUND_CODE = 404
  HTTP_UNPROCESSABLE_ENTITY_CODE = 429

  API_OFFICIAL_ENDPOINT = 'https://api.genius.com'
  API_UNOFFICIAL_ENDPOINT = 'https://genius.com/api'
  API_REQUSTS_QUOTA_REACHED_MESSAGE = 'API rate limit exceeded'.freeze

  def initialize
    @auth_email = Rails.application.credentials.dig(:genius_api, :user)
    @auth_password = Rails.application.credentials.dig(:genius_api, :password)

    @songs = {}
  end

  def search query
    request(
      http_method: :get,
      endpoint: "search",
      params: {
        q: query
      }
    )&.dig("response", "hits")&.map { |hit| hit["result"] 
    }&.map { |song_data| to_song(song_data) } || []
  end

  def song id
    @songs[id] ||= request(
      http_method: :get,
      endpoint: "songs/#{id}"
    )&.dig("response", "song").then{ |song_data| to_song(song_data)}
  end

  def artist id
    request(
      http_method: :get,
      endpoint: "artists/#{id}"
    )&.dig("response", "artist").then{ |artist_data| to_artist(artist_data)}
  end

  def artist_songs artist_id, order: nil
    artist_params = {}
    artist_params[:sort] = order if order.present?
    request(
      http_method: :get,
      endpoint: "artists/#{artist_id}/songs",
      params: artist_params
    )&.dig("response", "songs")&.map { |song_data| to_song(song_data) } || []
  end

  def lyrics song_id
    song = song(song_id)
    return nil if song.nil?

    lyrics_url = song.path
    html = Net::HTTP.get(URI("https://genius.com#{lyrics_url}"))
    doc = Nokogiri::HTML(html)
    doc.css("[data-lyrics-container='true']").map do |lc|
      lc.children.map do |e|
        if e.children.length > 0
          e.children.map do |c|
            if c.children.length > 0
              c.children.map do |cc|
                if cc.content.present?
                  cc.content
                elsif cc.name == "br"
                  "\n"
                end
              end.compact.join
            elsif c.content.present?
              c.content
            elsif e.name == "br"
              "\n"
            end
          end.compact.join
        elsif e.content.present?
          e.content
        elsif e.name == "br"
          "\n"
        end
      end.compact.join
    end.compact.join.gsub(/\[.*\]\n/, "").strip
  rescue => e
    Rails.logger.error e.message
    nil
  end

  private
  def login
    bearer = request(
      http_method: :post,
      endpoint: "api/v1/login",
      params: {
        email: @auth_email,
        password: @auth_password
      },
    retries: 0)["access"]
    client(bearer: bearer)
  end

  def refresh_token
    request(
      http_method: :post,
      endpoint: "api/v1/refresh"
    )
  end

  def client bearer: nil
    @_client = if @_client.nil? or bearer.present?
      Faraday.new(API_UNOFFICIAL_ENDPOINT) do |client|
        client.request :url_encoded
        client.adapter Faraday.default_adapter
        client.headers['Authorization'] = "Bearer #{bearer}" if bearer.present?
        client.options.timeout = 600
      end
    else
      @_client
    end
  end

  def request(http_method:, endpoint:, params: {}, retries: 2)
    endpoint += "?#{params.to_query}" if http_method == :get and params.present?
    @response = client.public_send(http_method, endpoint, params)
    if response_successful?
      case @response.headers["content-type"]
      when /application\/json/
        JSON.parse(@response.body) if @response.status != 204
      when /application\/pdf/
        @response.body
      else
        {}
      end
    elsif @response.status == 404
      raise error_class, "Código #{@response.status}: no encontrado"
    elsif @response.status == 422
      raise error_class, "Código #{@response.status}: #{JSON.parse(@response.body) }"
    elsif @response.status == 401 and retries == 1
      login
      request(http_method: http_method, endpoint: endpoint, params: params, retries: 0)
    elsif @response.status == 401 and retries > 0
      request(http_method: http_method, endpoint: endpoint, params: params, retries: retries - 1)
    elsif @response.status == 401
      raise error_class, "Código #{@response.status}: #{JSON.parse(@response.body) }"
    else
      raise error_class, "Código #{@response.status}"
    end
  end

  def error_class
    case @response.status
    when HTTP_BAD_REQUEST_CODE
      BadRequestError
    when HTTP_UNAUTHORIZED_CODE
      UnauthorizedError
    when HTTP_FORBIDDEN_CODE
      return ApiRequestsQuotaReachedError if api_requests_quota_reached?
      ForbiddenError
    when HTTP_NOT_FOUND_CODE
      NotFoundError
    when HTTP_UNPROCESSABLE_ENTITY_CODE
      UnprocessableEntityError
    else
      ApiError
    end
  end

  def response_successful?
    @response.status.in?([HTTP_OK_CODE, HTTP_CREATED_CODE, HTTP_NO_CONTENT])
  end

  def api_requests_quota_reached?
    @response.body.match?(API_REQUSTS_QUOTA_REACHED_MESSAGE)
  end

  def to_song song_data
    return if song_data.nil?

    song = Song.new(
      eid: song_data["id"],
      name: song_data["title"],
      image_url: song_data['song_art_image_url'],
      thumbnail_url: song_data['song_art_image_thumbnail_url'],
      pageviews: song_data.dig("stats", "pageviews"),
      path: song_data["path"]
    )
    song.artist = to_artist(song_data["primary_artist"]) if song_data.dig("primary_artist", "id")
    song.album = to_album(song_data["album"]) if song_data.dig("album", "id")
    song
  end

  def to_artist artist_data
    return if artist_data.nil?

    artist = Artist.new(
      eid: artist_data["id"],
      name: artist_data["name"],
      image_url: artist_data["image_url"]
    )
  end

  def to_album album_data
    return if album_data.nil?

    album = Album.new(
      eid: album_data["id"],
      name: album_data["name"],
      image_url: album_data["cover_art_url"],
      year: album_data["release_date_for_display"]
    )
  end

end