class User < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :username, presence: true, uniqueness: true
  validates :password,
            length: { minimum: 6 },
            if: -> { new_record? || !password.nil? }
  has_many :playlists, dependent: :destroy
  has_many :songs, through: :playlists
  has_one :player, dependent: :destroy
  has_many :favorites, -> { order(:favorite_index) }, dependent: :destroy
  has_many :favorite_songs, through: :favorites, source: :song

  def to_param
    username
  end

  def player
    super || create_player
  end
end