class Api::V1::ArtistsController < Api::V1::ApiController
  before_action :authorize_request
  before_action :set_artist, only: %i[ show ]
  before_action :set_persisted_artist, only: %i[ update destroy ]

  # GET /artists
  def index
    @artists = Artist.all

    render json: @artists
  end

  # GET /artists/1
  def show
  end

  # POST /artists
  def create
    @artist = Artist.new(artist_params)

    if @artist.save
      render json: @artist, status: :created, location: [:api, :v1, @artist]
    else
      render json: @artist.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /artists/1
  def update
    if @artist.update(artist_params.except(:eid))
      render json: @artist
    else
      render json: @artist.errors, status: :unprocessable_entity
    end
  end

  # DELETE /artists/1
  def destroy
    @artist.destroy!
  end

  private
    def set_artist
      @artist = Artist.find_or_initialize_by_eid(params[:eid])
    end

    def set_persisted_artist
      @artist = Artist.find_by!(eid: params[:eid])
    end

    # Only allow a list of trusted parameters through.
    def artist_params
      params.require(:artist).permit(:eid, :name, :image_url)
    end
end
