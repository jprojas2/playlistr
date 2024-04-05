require "test_helper"

class AlbumsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper

  setup do
    @album = albums(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_albums_url)
    assert_auth_endpoint(:post, api_v1_albums_url)
    assert_auth_endpoint(:get, api_v1_album_url(@album))
    assert_auth_endpoint(:patch, api_v1_album_url(@album))
    assert_auth_endpoint(:delete, api_v1_album_url(@album))
  end

  test "should get index" do
    get api_v1_albums_url, as: :json, headers: @headers
    assert_response :success
  end

  test "should create album" do
    assert_difference("Album.count") do
      post api_v1_albums_url, params: { album: { eid: "1234", image_url: @album.image_url, name: @album.name, year: @album.year } }, as: :json, headers: @headers
    end

    assert_response :created
  end

  test "should show album" do
    get api_v1_album_url(@album), as: :json, headers: @headers
    assert_response :success
  end

  test "should update album" do
    patch api_v1_album_url(@album), params: { album: { eid: @album.eid, image_url: @album.image_url, name: @album.name, year: @album.year } }, as: :json, headers: @headers
    assert_response :success
  end

  test "should destroy album" do
    assert_difference("Album.count", -1) do
      delete api_v1_album_url(@album), as: :json, headers: @headers
    end

    assert_response :no_content
  end
end
