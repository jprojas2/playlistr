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
end