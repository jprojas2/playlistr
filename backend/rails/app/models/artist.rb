class Artist < ApplicationRecord
  include ExternalId
  has_many :albums, dependent: :destroy
  has_many :songs, dependent: :destroy

  attr_accessor :top_songs

  def self.initialize_by_eid eid
    Genius.new.artist(eid)
  end

  def top_songs
    Genius.new.artist_songs(eid, order: "popularity").sort_by do |songs|
      songs.pageviews || 0
    end.reverse[0..4]
  end
end
