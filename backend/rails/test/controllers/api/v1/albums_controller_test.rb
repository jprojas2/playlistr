require "test_helper"

class AlbumsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper

  setup do
    @album = albums(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_albums_url)
    assert_auth_endpoint(:get, api_v1_album_url(@album))
  end

  test "should get index" do
    get api_v1_albums_url, as: :json, headers: @headers
    assert_response :success
  end

  test "should show album" do
    get api_v1_album_url(@album), as: :json, headers: @headers
    assert_response :success
  end
end
