class Api::V1::FavoritesController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_favorite_collection, only: %i[ index reorder ]

  def reorder
    params[:favorites].each_with_index do |favorite, index|
      @favorites.find(favorite[:id]).update(favorite_index: index)
    end
    render :index
  end

  def destroy
    @favorite = @current_user.favorites.find(params[:id])
    @favorite.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_favorite_collection
      @favorites = @current_user.favorites.includes(:song)
    end

    # Only allow a list of trusted parameters through.
    def favorite_params
      params.require(:favorite).permit(:user_id, :song_id, :favorite_index)
    end
end
