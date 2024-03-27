module Minitest::AuthHelper
  def login
    @user = users(:one)
    login_as(@user)
  end

  def login_as(user)
    @token = JsonWebToken.encode(user_id: user.id)
    @headers = { Authorization: "Bearer " + @token }
  end

  def logout
    @token = nil
  end

  def assert_auth_endpoint(method, url, params = nil)
    send(method, url, params: params, as: :json, headers: { Authorization: "Bearer " + "invalid_token" })
    assert_response :unauthorized
  end
end