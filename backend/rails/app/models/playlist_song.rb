class PlaylistSong < ApplicationRecord
  belongs_to :playlist
  belongs_to :song

  after_destroy :reorder_songs

  private

  def reorder_songs
    playlist.playlist_songs.order(:song_index).each_with_index do |playlist_song, index|
      playlist_song.update!(song_index: index)
    end
  end
end