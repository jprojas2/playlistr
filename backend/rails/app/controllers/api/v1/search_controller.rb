class Api::V1::SearchController < Api::V1::ApiController
  before_action :authorize_request

  # GET /search
  def index
    render json: Genius.new.search(params[:q])
  end
end