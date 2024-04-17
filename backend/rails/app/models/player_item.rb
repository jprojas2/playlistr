class PlayerItem < ApplicationRecord
  belongs_to :player
  belongs_to :song

  validates :song_id, uniqueness: { scope: :player_id }
  validates :song_index, uniqueness: { scope: :player_id }
end