require "test_helper"

class FavoritesControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper

  setup do
    @favorite = favorites(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_favorites_url)
  end

  test "should get index" do
    get api_v1_favorites_url, headers: @headers
    assert_response :success
  end
end
