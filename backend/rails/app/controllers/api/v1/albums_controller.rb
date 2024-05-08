class Api::V1::AlbumsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_album, only: %i[ show ]

  def index
    @albums = Album.all
  end

  private
    def set_album
      @album = Album.find_by!(eid: params[:eid])
    end

    def album_params
      params.require(:album).permit(:eid, :artist_id, :name, :year, :image_url)
    end
end
