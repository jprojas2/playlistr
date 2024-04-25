class Api::V1::SongsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_song, only: %i[ show lyrics play]
  before_action :persist_song, only: %i[ play]

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

  def play
    @player = @current_user.player
    @player.play_song(@song)

    render 'api/v1/players/show'
  rescue => e
    puts e.message
    render json: { error: 'Player not found' }, status: :not_found
  end

  private
    def set_song
      @song = Song.find_or_initialize_by_eid(params[:eid])
    end

    def persist_song
      @song.save if @song.new_record?
    end

    # Only allow a list of trusted parameters through.
    def song_params
      params.require(:song).permit(:eid, :name, :artist_id, :album_id, :favorite, :lyrics, :duration, :image_url)
    end
end
