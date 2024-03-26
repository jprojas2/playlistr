require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper
  # test "the truth" do
  #   assert true
  # end
  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_users_url)
    assert_auth_endpoint(:post, api_v1_users_url)
    assert_auth_endpoint(:get, api_v1_user_url(users(:one)))
    assert_auth_endpoint(:patch, api_v1_user_url(users(:one)))
    assert_auth_endpoint(:delete, api_v1_user_url(users(:one)))
  end
end
