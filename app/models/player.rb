class Player < ApplicationRecord
  belongs_to :user
  belongs_to :song, optional: true

  validates :user_id, uniqueness: true
end
