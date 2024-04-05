class ApplicationController < ActionController::API
  before_action :cors
  
  def not_found
    render json: { error: 'not_found' }
  end

  def react
    send_file "#{Rails.root}/public/index.html", type: 'text/html', disposition: 'inline'
  end

  private

  def cors
    response.headers['Access-Control-Allow-Origin'] = Rails.env.production? ? ENV["APP_URL"] : '*'
  end

end
