class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :song

  validates :user_id, uniqueness: { scope: :song_id }
  after_destroy :reorder_favorites

  private

  def reorder_favorites
    user.favorites.order(:favorite_index).each_with_index do |favorite, index|
      favorite.update(favorite_index: index)
    end
  end

end
