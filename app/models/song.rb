class Song < ApplicationRecord
  belongs_to :artist, optional: true
  belongs_to :album, optional: true
  has_many :players, dependent: :nullify
  has_and_belongs_to_many :playlists
end
