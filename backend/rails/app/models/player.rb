class Player < ApplicationRecord
  belongs_to :user
  has_many :player_items, -> { order(:song_index) }, dependent: :destroy
  has_many :songs, through: :player_items

  validates :user_id, uniqueness: true

  def current_song
    songs.where('player_items.song_index = ?', playing_index).first
  end
end
