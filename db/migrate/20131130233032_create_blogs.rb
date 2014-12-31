class CreateBlogs < ActiveRecord::Migration
  def change
    create_table :blogs do |t|
      t.string :title
      t.text :body_md
      t.text :body_html
      t.datetime :published_at
      t.integer :views

      t.timestamps
    end
  end
end
