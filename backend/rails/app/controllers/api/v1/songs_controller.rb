class Api::V1::SongsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_song, only: %i[ show lyrics ]
  before_action :set_persisted_song, only: %i[ update destroy ]

  # GET /songs
  def index
    @songs = Song.all

    render json: @songs
  end

  # GET /songs/1
  def show
    render json: @song
  end

  # POST /songs
  def create
    @song = Song.new(song_params)

    if @song.save
      render json: @song, status: :created, location: [:api, :v1, @song]
    else
      render json: @song.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /songs/1
  def update
    if @song.update(song_params.except(:eid))
      render json: @song
    else
      render json: @song.errors, status: :unprocessable_entity
    end
  end

  # DELETE /songs/1
  def destroy
    @song.destroy!
  end

  def lyrics
    @song.get_lyrics

    render json: { lyrics: @song.lyrics }
  end

  private
    def set_song
      @song = Song.find_or_initialize_by_eid(params[:eid])
    end

    def set_persisted_song
      @song = Song.find_by!(eid: params[:eid])
    end

    # Only allow a list of trusted parameters through.
    def song_params
      params.require(:song).permit(:eid, :name, :artist_id, :album_id, :favorite, :lyrics, :duration, :image_url)
    end
end
