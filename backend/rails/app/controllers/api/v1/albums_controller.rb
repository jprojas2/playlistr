class Api::V1::AlbumsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_album, only: %i[ show ]

  # GET /albums
  def index
    @albums = Album.all

    render json: @albums
  end

  # GET /albums/1
  def show
    render json: @album
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_album
      @album = Album.find_by!(eid: params[:eid])
    end

    # Only allow a list of trusted parameters through.
    def album_params
      params.require(:album).permit(:eid, :artist_id, :name, :year, :image_url)
    end
end
