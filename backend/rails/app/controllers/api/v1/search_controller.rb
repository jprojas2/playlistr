class Api::V1::SearchController < Api::V1::ApiController
  before_action :authorize_request

  # GET /search
  def index
    case params[:type]
    when "song"
      @results = Genius.new.search(params[:q])
    else
      @results = process_search(Genius.new.search(params[:q]))
    end
  end

  def process_search search_results
    artists = search_results.map{|e| e.artist&.name =~ /#{params[:q]}/i && e.artist }
      .compact.uniq{|e| e.eid}
    hot_songs = search_results.select{|e| (e.pageviews || 0) > 500_000 && e.name =~ /#{params[:q]}/i}
    (hot_songs + artists + (search_results - hot_songs)).uniq
  end
end