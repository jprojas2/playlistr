require "test_helper"

class ArtistsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper

  setup do
    @artist = artists(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_artists_url)
    assert_auth_endpoint(:post, api_v1_artists_url)
    assert_auth_endpoint(:get, api_v1_artist_url(@artist))
    assert_auth_endpoint(:patch, api_v1_artist_url(@artist))
    assert_auth_endpoint(:delete, api_v1_artist_url(@artist))
  end

  test "should get index" do
    get api_v1_artists_url, as: :json, headers: @headers
    assert_response :success
  end

  test "should create artist" do
    assert_difference("Artist.count") do
      post api_v1_artists_url, params: { artist: { eid: "1234", image_url: @artist.image_url, name: @artist.name } }, as: :json, headers: @headers
    end

    assert_response :created
  end

  test "should show artist" do
    Artist.expects(:find_or_initialize_by_eid).with(@artist.eid).once.returns(@artist)
    get api_v1_artist_url(@artist), as: :json, headers: @headers
    assert_response :success
  end

  test "should update artist" do
    patch api_v1_artist_url(@artist), params: { artist: { image_url: @artist.image_url, name: @artist.name } }, as: :json, headers: @headers
    assert_response :success
  end

  test "should destroy artist" do
    assert_difference("Artist.count", -1) do
      delete api_v1_artist_url(@artist), as: :json, headers: @headers
    end

    assert_response :no_content
  end
end
