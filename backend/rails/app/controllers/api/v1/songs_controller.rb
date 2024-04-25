class Api::V1::SongsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_song, only: %i[ show lyrics ]


  # GET /songs
  def index
    @songs = Song.all

    render json: @songs
  end

  # GET /songs/1
  def show
    render json: @song
  end

  def lyrics
    @song.get_lyrics

    render json: { lyrics: @song.lyrics }
  end

  private
    def set_song
      @song = Song.find_or_initialize_by_eid(params[:eid])
    end

    # Only allow a list of trusted parameters through.
    def song_params
      params.require(:song).permit(:eid, :name, :artist_id, :album_id, :favorite, :lyrics, :duration, :image_url)
    end
end
