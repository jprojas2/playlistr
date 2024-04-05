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
      post api_v1_songs_url, params: { song: { album_id: @song.album_id, artist_id: @song.artist_id, duration: @song.duration, eid: "1234", favorite: @song.favorite, image_url: @song.image_url, lyrics: @song.lyrics, name: @song.name } }, as: :json, headers: @headers
    end

    assert_response :created
  end

  test "should show song" do
    Song.expects(:find_or_initialize_by_eid).with(@song.eid).once.returns(@song)

    get api_v1_song_url(@song), as: :json, headers: @headers
    assert_response :success
    assert_equal @song.eid, JSON.parse(response.body)["eid"]
  end

  test "should update song" do
    patch api_v1_song_url(@song), params: { song: { album_id: @song.album_id, artist_id: @song.artist_id, duration: @song.duration, favorite: @song.favorite, image_url: @song.image_url, lyrics: @song.lyrics, name: @song.name } }, as: :json, headers: @headers
    assert_response :success
  end

  test "should destroy song" do
    assert_difference("Song.count", -1) do
      delete api_v1_song_url(@song), as: :json, headers: @headers
    end

    assert_response :no_content
  end

  test "should get lyrics" do
    Song.expects(:find_or_initialize_by_eid).with(@song.eid).once.returns(@song)
    Song.any_instance.expects(:get_lyrics).once
    get lyrics_api_v1_song_url(@song), as: :json, headers: @headers

    assert JSON.parse(response.body).key?("lyrics")
    assert_response :success
  end
end
