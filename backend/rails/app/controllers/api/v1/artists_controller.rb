class Api::V1::ArtistsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_artist, only: %i[ show ]

  # GET /artists
  def index
    @artists = Artist.all

    render json: @artists
  end

  # GET /artists/1
  def show
  end

  private
    def set_artist
      @artist = Artist.find_or_initialize_by_eid(params[:eid])
    end

    # Only allow a list of trusted parameters through.
    def artist_params
      params.require(:artist).permit(:eid, :name, :image_url)
    end
end
