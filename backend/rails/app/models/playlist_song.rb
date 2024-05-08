class PlaylistSong < ApplicationRecord
  belongs_to :playlist
  belongs_to :song

  validates_uniqueness_of :song_id, scope: :playlist_id

  after_destroy :reorder_songs

  def to_param
    song_index.to_s
  end

  private

  def reorder_songs
    playlist.playlist_songs.order(:song_index).each_with_index do |playlist_song, index|
      playlist_song.update!(song_index: index)
    end
  end
end