class Artist < ApplicationRecord
  include ExternalId
  has_many :albums, dependent: :destroy
  has_many :songs, dependent: :destroy

  def self.initialize_by_eid eid
    artist_data = Genius.new.artist(eid)
    return if artist_data.nil?

    new(
      eid: eid,
      name: artist_data["name"],
      image_url: artist_data["image_url"]
    )
  end

  def top_songs
    top_songs = Genius.new.artist_songs(eid, order: "popularity").sort_by do |song_data|
      song_data.dig("stats", "pageviews") || 0
    end.reverse[0..4]
  end
end
