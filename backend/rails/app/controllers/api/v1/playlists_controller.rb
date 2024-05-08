class Api::V1::PlaylistsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_playlist_collection
  before_action :set_playlist, only: %i[ show update destroy play reorder remove_song ]

  def index
    @playlists = @playlists.includes(:songs)
  end

  def create
    @playlist = @playlists.new(playlist_params)

    if @playlist.save
      render json: @playlist, status: :created, location: [:api, :v1, @playlist]
    else
      render json: @playlist.errors, status: :unprocessable_entity
    end
  end

  def update
    if @playlist.update(playlist_params)
      render json: @playlist
    else
      render json: @playlist.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @playlist.destroy!
  end

  def play
    player = @current_user.player.play_playlist(@playlist)
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Could not play playlist' }, status: :unprocessable_entity
  end

  def reorder
    @playlist.playlist_songs.each do |playlist_song|
      playlist_song.update!(song_index: params[:song_indexes].index(playlist_song.song_index))
    end
    head :no_content
  end

  def remove_song
    @playlist.playlist_songs.find_by!(song_id: params[:song_id]).destroy!
  end

  private
    def set_playlist_collection
      @playlists = Playlist.where(user_id: @current_user.id)
    end

    def set_playlist
      @playlist = @playlists.includes(playlist_songs: {song: [:artist, :album] }).find(params[:id])
    end

    def playlist_params
      params.require(:playlist).permit(:name)
    end
end
