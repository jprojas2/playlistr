class Api::V1::SearchController < Api::V1::ApiController
  before_action :authorize_request

  # GET /search
  def index
    case params[:type]
    when "song"
      render json: Genius.new.search(params[:q])
    else
      render json: process_search(Genius.new.search(params[:q]))
    end
  end

  def process_search search_results
    artists = search_results.map{|e| e.dig("primary_artist", "name") =~ /#{params[:q]}/i && e["primary_artist"]}.compact.flatten.uniq
    hot_songs = search_results.select{|e| (e.dig("stats", "pageviews") || 0) > 500_000 && e["title"] =~ /#{params[:q]}/i}
    (hot_songs + artists + (search_results - hot_songs)).uniq
  end
end