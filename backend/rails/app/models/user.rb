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
  has_one_attached :avatar

  before_save :crop_avatar, if: -> { crop_options.present? && avatar_data.present? }
  attr_accessor :crop_options, :avatar_data

  def to_param
    username
  end

  def player
    super || create_player
  end

  private

  def crop_avatar

    # Get the crop options

    crop_x = crop_options[:x].to_i
    crop_y = crop_options[:y].to_i
    crop_width = crop_options[:width].to_i
    crop_height = crop_options[:height].to_i

    # Get the image

   

    content_type = avatar_data.split('\;').first
    if(content_type.include?('data:image/'))
      decoded_data = Base64.decode64(avatar_data.split(',')[1])
      extension = content_type.split('/').last

      tmp_file_path = "tmp/#{SecureRandom.uuid}.#{extension}"
      File.open(tmp_file_path, 'wb') do |f|
        f.write(decoded_data)
      end

      image = ImageProcessing::MiniMagick.source(tmp_file_path)
      image.crop("#{crop_width}x#{crop_height}+#{crop_x}+#{crop_y}").call(destination: tmp_file_path)

      self.avatar = { 
        io: StringIO.new(File.open(tmp_file_path, 'rb').read),
        content_type: content_type,
        filename: "avatar.#{extension}"
      }
      File.delete(tmp_file_path)
    end
  end
end