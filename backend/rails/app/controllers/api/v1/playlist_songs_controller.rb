class Api::V1::PlaylistSongsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_playlist
  before_action :set_playlist_song, only: %i[ destroy ]

  # GET /playlist_songs
  def index
    @playlist_songs = PlaylistSong.all
  end

  def create
    @playlist_song = @playlist.playlist_songs.new(playlist_song_params)
    @playlist_song.song_index = @playlist.playlist_songs.count
    @playlist_song.song = Song.find_or_initialize_by_eid(playlist_song_params[:song_id])
    if @playlist_song.song.save && @playlist_song.save
      head :created
    else
      render json: @playlist_song.errors, status: :unprocessable_entity
    end
  end

  def play
    player = @current_user.player.play_playlist(@playlist, params[:song_index])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Could not play playlist' }, status: :unprocessable_entity
  end

  def destroy
    @playlist_song.destroy!
  end

  private
    def set_playlist
      @playlist = @current_user.playlists.find(params[:playlist_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_playlist_song
      @playlist_song = @playlist.playlist_songs.find_by!(song_index: params[:song_index])
    end

    # Only allow a list of trusted parameters through.
    def playlist_song_params
      params.require(:playlist_song).permit(:song_id, :playlist_id, :song_index)
    end
end
