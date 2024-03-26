require "test_helper"

class SongsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper

  setup do
    @song = songs(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_songs_url)
    assert_auth_endpoint(:post, api_v1_songs_url)
    assert_auth_endpoint(:get, api_v1_song_url(@song))
    assert_auth_endpoint(:patch, api_v1_song_url(@song))
    assert_auth_endpoint(:delete, api_v1_song_url(@song))
  end

  test "should get index" do
    get api_v1_songs_url, as: :json, headers: @headers
    assert_response :success
  end

  test "should create song" do
    assert_difference("Song.count") do
      post api_v1_songs_url, params: { song: { album_id: @song.album_id, artist_id: @song.artist_id, duration: @song.duration, eid: @song.eid, favorite: @song.favorite, image_url: @song.image_url, lyrics: @song.lyrics, name: @song.name } }, as: :json, headers: @headers
    end

    assert_response :created
  end

  test "should show song" do
    get api_v1_song_url(@song), as: :json, headers: @headers
    assert_response :success
  end

  test "should update song" do
    patch api_v1_song_url(@song), params: { song: { album_id: @song.album_id, artist_id: @song.artist_id, duration: @song.duration, eid: @song.eid, favorite: @song.favorite, image_url: @song.image_url, lyrics: @song.lyrics, name: @song.name } }, as: :json, headers: @headers
    assert_response :success
  end

  test "should destroy song" do
    assert_difference("Song.count", -1) do
      delete api_v1_song_url(@song), as: :json, headers: @headers
    end

    assert_response :no_content
  end
end
