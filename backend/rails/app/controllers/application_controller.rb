class ApplicationController < ActionController::API
  before_action :cors_set_access_control_headers
  before_action :set_default_response_format

  def not_found
    render json: { error: 'not_found' }
  end

  def react
    send_file "#{Rails.root}/public/index.html", type: 'text/html', disposition: 'inline'
  end

  def cors_preflight_check
  end
  
  protected

  def cors_set_access_control_headers
    response.headers['Access-Control-Allow-Origin'] = Rails.env.production? ? ENV["APP_URL"] : '*'
    response.headers['Access-Control-Allow-Credentials'] = "true"
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token, Auth-Token, Email, X-User-Token, X-User-Email'
    response.headers['Access-Control-Max-Age'] = '86400'
  end

  def set_default_response_format
    request.format = :json
  end

end
