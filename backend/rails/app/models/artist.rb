class Artist < ApplicationRecord
  include ExternalId
  has_many :albums, dependent: :destroy
  has_many :songs, dependent: :destroy
end
