class Song < ApplicationRecord
  include ExternalId
  belongs_to :artist, optional: true
  belongs_to :album, optional: true
  has_many :player_items, dependent: :destroy
  has_many :playlist_songs, dependent: :destroy
  has_many :playlists, through: :playlist_songs
  has_many :favorites, dependent: :destroy

  attr_accessor :pageviews, :path, :apple_music_player_url

  def self.initialize_by_eid eid
    song = Genius.new.song(eid)
    song.artist = Artist.find_or_initialize_by_eid(song.artist.eid) if song.artist
    song
  end

  def favorited user
    user.favorites.exists?(song_id: id)
  end

  def get_lyrics
    return lyrics if lyrics.present?
    
    self.lyrics = Genius.new.lyrics(eid)
    save unless new_record?
  end

  def get_duration
    return duration if duration.present?

    self.duration = Genius.new.duration(eid)
    save unless new_record?
  end
end
