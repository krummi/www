json.array!(@blogs) do |blog|
  json.extract! blog, :title, :body_md, :body_html, :published_at, :views
  json.url blog_url(blog, format: :json)
end
