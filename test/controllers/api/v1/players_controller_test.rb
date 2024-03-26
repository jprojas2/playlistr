require "test_helper"

class PlayersControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper
  
  setup do
    @player = players(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_players_url)
    assert_auth_endpoint(:post, api_v1_players_url)
    assert_auth_endpoint(:get, api_v1_player_url(@player))
    assert_auth_endpoint(:patch, api_v1_player_url(@player))
    assert_auth_endpoint(:delete, api_v1_player_url(@player))
  end

  test "should get index" do
    get api_v1_players_url, as: :json, headers: @headers
    assert_response :success
  end

  test "should create player" do
    assert_difference("Player.count") do
      post api_v1_players_url, params: { player: { paused_at: @player.paused_at, song_id: @player.song_id, started_at: @player.started_at } }, as: :json, headers: @headers
    end

    assert_response :created
  end

  test "should show player" do
    get api_v1_player_url(@player), as: :json, headers: @headers
    assert_response :success
  end

  test "should update player" do
    patch api_v1_player_url(@player), params: { player: { paused_at: @player.paused_at, song_id: @player.song_id, started_at: @player.started_at } }, as: :json, headers: @headers
    assert_response :success
  end

  test "should destroy player" do
    assert_difference("Player.count", -1) do
      delete api_v1_player_url(@player), as: :json, headers: @headers
    end

    assert_response :no_content
  end
end
