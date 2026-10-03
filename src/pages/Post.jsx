import { useParams } from 'react-router-dom'
import { getPostBySlug } from '../posts/index.js'
import NotFound from './NotFound.jsx'

export default function Post() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  if (!post) {
    return <NotFound />
  }
  const { Component } = post
  return <Component />
}
