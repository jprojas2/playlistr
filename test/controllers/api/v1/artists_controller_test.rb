require "test_helper"

class ArtistsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper

  setup do
    @artist = artists(:one)
    login
  end

  test "should get index" do
    get api_v1_artists_url, as: :json, headers: @headers
    assert_response :success
  end

  test "should create artist" do
    assert_difference("Artist.count") do
      post api_v1_artists_url, params: { artist: { eid: @artist.eid, image_url: @artist.image_url, name: @artist.name } }, as: :json, headers: @headers
    end

    assert_response :created
  end

  test "should show artist" do
    get api_v1_artist_url(@artist), as: :json, headers: @headers
    assert_response :success
  end

  test "should update artist" do
    patch api_v1_artist_url(@artist), params: { artist: { eid: @artist.eid, image_url: @artist.image_url, name: @artist.name } }, as: :json, headers: @headers
    assert_response :success
  end

  test "should destroy artist" do
    assert_difference("Artist.count", -1) do
      delete api_v1_artist_url(@artist), as: :json, headers: @headers
    end

    assert_response :no_content
  end
end
