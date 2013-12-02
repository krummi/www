class AddIsPublishedToBlogs < ActiveRecord::Migration
  def change
    add_column :blogs, :is_published, :boolean
  end
end
