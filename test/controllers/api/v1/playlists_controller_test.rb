require "test_helper"

class PlaylistsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper
  
  setup do
    @playlist = playlists(:one)
    login
  end

  test "should get index" do
    get api_v1_playlists_url, as: :json, headers: @headers
    #should get playlists belonging to the user
    
    assert_response :success
  end

  test "should create playlist" do
    assert_difference("Playlist.count") do
      post api_v1_playlists_url, params: { playlist: { name: @playlist.name } }, as: :json, headers: @headers
    end

    assert_response :created
  end

  test "should show playlist" do
    get api_v1_playlist_url(@playlist), as: :json, headers: @headers
    assert_response :success
  end

  test "should update playlist" do
    patch api_v1_playlist_url(@playlist), params: { playlist: { name: @playlist.name } }, as: :json, headers: @headers
    assert_response :success
  end

  test "should destroy playlist" do
    assert_difference("Playlist.count", -1) do
      delete api_v1_playlist_url(@playlist), as: :json, headers: @headers
    end

    assert_response :no_content
  end
end
