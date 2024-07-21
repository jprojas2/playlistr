class Api::V1::PlayersController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_player

  # GET /player
  def show
  end

  # POST /player
  def create
    @player.assign_attributes(player_params)

    if @player.save
      render json: @player, status: :created, location: [:api, :v1, @player]
    else
      render json: @player.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /player
  def update
    if @player.update(player_params)
      render json: @player
    else
      render json: @player.errors, status: :unprocessable_entity
    end
  end

  # DELETE /player
  def destroy
    @player.destroy!
  end

  [:play, :pause, :next, :previous, :rewind].each do |action|
    define_method action do
      @player.send(action)

      render :show
    rescue
      render json: { error: 'Player not found' }, status: :not_found
    end
  end

  def get_duration
    @player.current_song&.get_duration

    render :show
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_player
      @player = Player.find_or_initialize_by(user_id: @current_user.id)
    end

    # Only allow a list of trusted parameters through.
    def player_params
      params.require(:player).permit(:playing, :started_at, :paused_at)
    end
end
