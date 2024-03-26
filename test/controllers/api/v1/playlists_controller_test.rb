require "test_helper"

class PlaylistsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper
  
  setup do
    @user = users(:one)
    @playlist = playlists(:one)
    login_as(@user)
  end

  test "should get index of current user's playlists" do
    get api_v1_playlists_url, as: :json, headers: @headers

    assert_response :success
    
    assert_equal @user.playlists.map(&:id), response.parsed_body.map { |playlist| playlist["id"] }
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
