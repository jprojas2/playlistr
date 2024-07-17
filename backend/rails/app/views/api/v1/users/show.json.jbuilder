json.(@user, :id)
json.(@user, :username)
json.(@user, :name)
json.(@user, :email)
json.avatar @user.avatar.attached? ? url_for(@user.avatar) : nil