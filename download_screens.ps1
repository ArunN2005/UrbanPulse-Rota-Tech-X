$urls = @(
    @("Welcome_Screen.png", "https://lh3.googleusercontent.com/aida/ADBb0uiX-0fEvkuj6XivbjY-uWRA6cHXCeb6qA1pezD244ZQ_smg_A63d4l-4DUTmWupU9eqoWJ5ggT3mJug9CA1RWiQzrvW5zZg5MTKm48VF_-VndpkZrVPBSqk7I4pNVdITxAYSZE6yHr9JoP21t110ODswWYcu3njwM9-mJMp3Cr01adVaudCzRvE4AybLJ4P_A2RRaw_qbJuIvr4XIS8Hb_V91-LS-rDiVjozTmU5hcwxfpgUBEKMS_zharu"),
    @("Welcome_Screen.html", "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzRhZTc0NzIzNGUzNjQ0MjZhZjlhZGRlNGVhYzdjYTBlEgsSBxD8spHA3R0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMzY1NTg4MjA4NjQ4ODEyNzEwNQ&filename=&opi=89354086"),
    @("New_Report.png", "https://lh3.googleusercontent.com/aida/ADBb0ujJCYJQGbdMj9auU6gvRDMnb99rp-zPLY38i5jHO18Pk70h0rVXW-5h5oZZoqYgwUxYGhil2WbvYHSaKIpMrq7Mv69eRsBXAhu4A7SdybnI7j0FrQO6h0fxOQ-SHkT6tTwBKe1ELZXdfrQPr5B0L82Cx0pmhcr4aISPetvLjkdbC70jzgwrxEFFv9W8O6BhSofjqFBbH0BBRYcQMS4VUt6X5h7yWB1Ucml5nSDiN2GgzvHPcL1yzLK71J7u"),
    @("New_Report.html", "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzM3ZjJjYWU3MmQyYTQxY2Q4MzI4NTg2MDFmMWNiMjcwEgsSBxD8spHA3R0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMzY1NTg4MjA4NjQ4ODEyNzEwNQ&filename=&opi=89354086"),
    @("Priority_Queue.png", "https://lh3.googleusercontent.com/aida/ADBb0uiu9eJmqtqCjjMx8dk102yD3SUus5PDACKsUGKzYYfW4fFTismnIVeXnuuR95ClueN-TJ4yZ8MTjeNnIm46YiRwtGSBeAOH6upM44J1i6LsihALzgMG6OCdFWci0AaDQ-Y4-BM3xhbyAJzE-9swYvoDWMmaZQwC5YC_MuWDfoW8_SdAnuh1TNqfCmRHdZTrtcb85bqYSjVxt4gRwAtbXUvVrgPUsgIL_TzkHyM0U3jOSRJVKjogVQ8b8jhx"),
    @("Priority_Queue.html", "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2MzYjhhYTk5NTEwMjQ4OTI4MjgxMDIyNWRhZjIwZmFkEgsSBxD8spHA3R0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMzY1NTg4MjA4NjQ4ODEyNzEwNQ&filename=&opi=89354086"),
    @("Citizen_Auth.png", "https://lh3.googleusercontent.com/aida/ADBb0ui0aLGO6pB7l2n3Sys_1fhnCfkF2bTfhkWDvrY9FxKNgjHnVox1rJCH6Gs9VndY9J5NEDa14-VYpk0ayiegYrZl1vkZiRvo_lRoBVeIjSwXvMWNvWBNpDMWH1JxBchZnXoExqq2n45w2UbCf6H1d1Zr3iJAJdCa4dyndc7qi9zXBswYWfqUGyq7254Q7V5m6lkl_0P5L0Wu7sS0yA6HbgSFg9pryA3ntf68kM5Oo2qt3RYyHpv9T7BY5UqT"),
    @("Citizen_Auth.html", "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2FjM2JhYzJkMmE1ZjQwZmI4NTRjMDRiMWRiYzNkZjNmEgsSBxD8spHA3R0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMzY1NTg4MjA4NjQ4ODEyNzEwNQ&filename=&opi=89354086"),
    @("Admin_Auth.png", "https://lh3.googleusercontent.com/aida/ADBb0uhhbl-FWIJKZj8hylbMt5JehuMR7P9X4mFhhd3PXQUZIJ6SHYRQW_YwEWpefYJAzDh0Y39cq-BfWfdWFKVQnB2SXtdmOOtOUsVo4jP6hZfyqlAWzqIixywDsx6ftH1ze9N7b_o6VnyF4RCI-F75rhLUP_hzZjKTlBasgkWPAFJILUZhEdgWxiQYsmAmMN5Sro_S6CwqqHH_K_2jx3Y1dVx6T2GOKYMUxVmxkJuiAuj1VMvyggie1Csc-ZxK"),
    @("Admin_Auth.html", "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzhiMWE5YmQ4NDY0NDRhOTg4ZDZmMmMzNDg2YTM2ZDkxEgsSBxD8spHA3R0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMzY1NTg4MjA4NjQ4ODEyNzEwNQ&filename=&opi=89354086"),
    @("Citizen_Dashboard.png", "https://lh3.googleusercontent.com/aida/ADBb0uiZrA7l0nYIfXlfKeSpym7X2JJmX7B9RqIkotbNBfYUtTT4nxeoQWha5MRvqttRamC1cDF7x6mupXp1jq3Sb2eB8hcVkXgYgxELQkh4WZLQJTxv30Z9yv7kapIbtj0A5kg-qApOROBsRuWjCISA1Ni6UEQN1WNxilrONZUu1vV7PBTyOSyIEppH5dFR-jrZfEKxRA6ydRgbaxqbzmAa_nHhiuExkFYl21_yKAnHs6AKo70YwZXyiUDmO4uV"),
    @("Citizen_Dashboard.html", "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2U0MjE2NmJiMTJmMzQ0ZjY4N2IxYzc4MmY4MDNkYTk3EgsSBxD8spHA3R0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMzY1NTg4MjA4NjQ4ODEyNzEwNQ&filename=&opi=89354086")
)

if (!(Test-Path -Path "stitch_screens")) {
    New-Item -ItemType Directory -Path "stitch_screens"
}
cd stitch_screens

foreach ($item in $urls) {
    $filename = $item[0]
    $url = $item[1]
    Write-Host "Downloading $filename..."
    curl.exe -L -s -o $filename $url
}
Write-Host "All downloads complete."
