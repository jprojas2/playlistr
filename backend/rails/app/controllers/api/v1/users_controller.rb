class Api::V1::UsersController < Api::V1::ApiController
  before_action :authorize_request
  before_action :find_user, except: %i[create index]

  def index
    @users = User.all
    render json: @users, status: :ok
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render :show, status: :ok
    else
      render json: { errors: @user.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def delete_avatar
    @user.avatar.purge
    render :show, status: :ok
  end

  def destroy
    @user.destroy
  end

  private

  def find_user
    if params[:_username].present?
      @user = User.find_by_username!(params[:_username])
    else
      @user = @current_user
    end

    #authorize user is current user or admin
    return if @current_user == @user #|| @current_user.admin
    render json: { errors: 'Permission denied' }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { errors: 'User not found' }, status: :not_found
  end

  def user_params
    params.require(:user).permit(
      :avatar_data, :name, :username, :email, :password, :password_challenge, crop_options: [:x, :y, :width, :height]
    )
  end
end