require "test_helper"

class PlaylistsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @playlist = playlists(:one)
  end

  test "should get index" do
    get playlists_url, as: :json
    assert_response :success
  end

  test "should create playlist" do
    assert_difference("Playlist.count") do
      post playlists_url, params: { playlist: { name: @playlist.name, user_id: @playlist.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show playlist" do
    get playlist_url(@playlist), as: :json
    assert_response :success
  end

  test "should update playlist" do
    patch playlist_url(@playlist), params: { playlist: { name: @playlist.name, user_id: @playlist.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy playlist" do
    assert_difference("Playlist.count", -1) do
      delete playlist_url(@playlist), as: :json
    end

    assert_response :no_content
  end
end
