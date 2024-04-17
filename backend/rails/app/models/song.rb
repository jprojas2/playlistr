class Song < ApplicationRecord
  include ExternalId
  belongs_to :artist, optional: true
  belongs_to :album, optional: true
  has_many :player_items, dependent: :destroy
  has_many :playlist_songs, dependent: :destroy
  has_many :playlists, through: :playlist_songs

  def self.initialize_by_eid eid
    song_data = Genius.new.song(eid)
    return if song_data.nil?

    song = new(
      eid: eid,
      name: song_data["title"],
      image_url: song_data['song_art_image_url']
    )

    if song_data.dig("primary_artist", "id")
      artist = Artist.find_or_initialize_by_eid(song_data["primary_artist"]["id"])
      song.artist = artist
    end

    if song_data.dig("album", "id")
      album = Album.find_or_initialize_by_eid(song_data["album"]["id"])
      album.assign_attributes(
        name: song_data["album"]["name"],
        image_url: song_data["album"]["cover_art_url"],
        year: song_data["album"]["release_date_for_display"]
      )
      song.album = album
    end
    
    song
  end

  def get_lyrics
    return lyrics if lyrics.present?
    
    self.lyrics = Genius.new.lyrics(eid)
    save unless new_record?
  end
end
