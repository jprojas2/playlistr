class Album < ApplicationRecord
  include ExternalId
  has_many :songs, dependent: :destroy
  belongs_to :artist, optional: true
end
