class Playlist < ApplicationRecord
  belongs_to :user
  has_many :playlist_songs, ->{ order(:song_index) }, dependent: :destroy
  has_many :songs, through: :playlist_songs
end
