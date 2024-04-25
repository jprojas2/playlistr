require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper
  # test "the truth" do
  #   assert true
  # end

  setup do
    @user = users(:one)
    login_as(@user)
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_users_url)
    assert_auth_endpoint(:post, api_v1_users_url)
    assert_auth_endpoint(:get, api_v1_user_url(users(:one)))
    assert_auth_endpoint(:patch, api_v1_user_url(users(:one)))
    assert_auth_endpoint(:delete, api_v1_user_url(users(:one)))
  end

  test 'should not be able to view other users' do
    get api_v1_user_url(users(:two)), as: :json, headers: @headers
    assert_response :unauthorized
  end

  test 'should not be able to update other users' do
    patch api_v1_user_url(users(:two)), as: :json, headers: @headers
    assert_response :unauthorized
  end

  test 'should not be able to delete other users' do
    delete api_v1_user_url(users(:two)), as: :json, headers: @headers
    assert_response :unauthorized
  end
end
